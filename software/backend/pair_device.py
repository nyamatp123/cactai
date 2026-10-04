import sys
from db import get_connection

with get_connection() as conn:
    plants = conn.execute(
        "SELECT id, name, species, device_id FROM plants ORDER BY id"
    ).fetchall()
    for p in plants:
        print(p)

    if len(sys.argv) == 3:
        plant_id, device_id = int(sys.argv[1]), sys.argv[2].strip()
        conn.execute(
            "UPDATE plants SET device_id = %s WHERE id = %s",
            (device_id, plant_id),
        )
        print(f"Paired plant {plant_id} with {device_id}")