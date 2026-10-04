# Fake sensor data for testing the dashboard.
# Usage: python seed_readings.py 4 5 6 [--count 8]
# Inserts the most recent --count readings (default 96 = the last 24 hours),
# one every 15 minutes, per plant id.
# Every row has soil_raw = -999, so they can be removed later with:
#   DELETE FROM sensor_readings WHERE soil_raw = -999
import argparse
import math
import random
from datetime import datetime, timedelta

from db import get_connection

SEED_MARK = -999
DAY_SLOTS = 96

parser = argparse.ArgumentParser(description="Insert fake 15-minute sensor readings.")
parser.add_argument("plant_ids", nargs="+", type=int, metavar="plant_id")
parser.add_argument("--count", type=int, default=DAY_SLOTS,
                    help="readings per plant, ending now (default 96 = 24 hours)")
args = parser.parse_args()
if args.count < 1:
    parser.error("--count must be at least 1")

plant_ids = args.plant_ids
count = args.count

# Local time, so the light curve peaks at midday on the dashboard
now = datetime.now().astimezone().replace(second=0, microsecond=0)
now -= timedelta(minutes=now.minute % 15)
times = [now - timedelta(minutes=15 * (count - 1 - i)) for i in range(count)]
day_start = now - timedelta(minutes=15 * (DAY_SLOTS - 1))

def day_fraction(t):
    # 0 at the start of the 24-hour window, 1 now, so a short --count gets the
    # tail of the same dry-down a full day would
    return (t - day_start) / (now - day_start)

def light_at(t):
    # Daylight from 06:00 to 20:00, peaking around 13:00
    hour = t.hour + t.minute / 60
    if hour < 6 or hour > 20:
        return 0.0
    return round(60000 * math.sin(math.pi * (hour - 6) / 14) + random.uniform(-1500, 1500))

with get_connection() as conn:
    for plant_id in plant_ids:
        if conn.execute("SELECT 1 FROM plants WHERE id = %s", (plant_id,)).fetchone() is None:
            print(f"Plant {plant_id} not found, skipped")
            continue

        rows = []
        for t in times:
            f = day_fraction(t)
            moisture = 42 - 10 * f + random.uniform(-0.4, 0.4)  # slow dry-down
            weight = 850 - 15 * f
            health = 90 + random.uniform(-2, 2)
            rows.append((plant_id, t, round(moisture, 1), max(0.0, light_at(t)),
                         round(weight, 1), round(health, 1), SEED_MARK))

        with conn.cursor() as cur:
            cur.executemany(
                "INSERT INTO sensor_readings "
                "(plant_id, recorded_at, moisture_pct, lux, weight_g, health_score, soil_raw) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s)",
                rows,
            )
        print(f"Plant {plant_id}: inserted {len(rows)} readings")
