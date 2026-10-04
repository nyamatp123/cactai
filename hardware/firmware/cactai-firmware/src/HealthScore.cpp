#include "HealthScore.h"
#include <Arduino.h>

float calcHealth(float moisture, float lux) {
  // Cactus: dry soil is good, soggy soil is bad
  float moistureScore;
  if (moisture < 15)       moistureScore = 100 - (15 - moisture) * 3;
  else if (moisture <= 35) moistureScore = 100;
  else                     moistureScore = 100 - (moisture - 35) * 2.2;
  moistureScore = constrain(moistureScore, 0, 100);

  // Cactus wants bright light (800+ lux is full marks)
  float lightScore = constrain(lux / 800.0 * 100.0, 0, 100);

  return moistureScore * 0.6 + lightScore * 0.4;
}

Mood moodFromHealth(float health) {
  if (health >= 70) return MOOD_HAPPY;
  if (health >= 40) return MOOD_OK;
  return MOOD_SAD;
}

const char* statusFromMoisture(float moisture) {
  if (moisture < 20) return "Needs water";
  if (moisture < 40) return "Nice and dry";
  if (moisture < 60) return "Recently watered";
  if (moisture < 80) return "Getting too wet";
  return "Overwatered!";
}