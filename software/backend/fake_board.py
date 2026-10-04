import json, os, random, time, urllib.request, urllib.error

URL = "http://localhost:8000/readings"
KEY = os.environ["DEVICE_KEY"]
DEVICE = "3C:8A:1F:A3:FA:CC"
INTERVAL = 3  # seconds between readings

moisture, lux = 40.0, 1500.0
while True:
    moisture = min(60, max(10, moisture + random.uniform(-0.6, 0.4)))
    lux = min(3000, max(200, lux + random.uniform(-250, 250)))
    body = json.dumps({
        "device_id": DEVICE, "moisture_pct": round(moisture, 1),
        "soil_raw": -999, "lux": round(lux, 1),
        "weight_g": 512.3, "health_score": 92,
    }).encode()
    req = urllib.request.Request(
        URL, body, {"Content-Type": "application/json", "X-Device-Key": KEY}
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as r:
            print(r.status, round(moisture, 1), round(lux))
    except urllib.error.HTTPError as e:
        print("HTTP", e.code, e.read().decode())
    except Exception as e:
        print("error:", e)
    time.sleep(INTERVAL)