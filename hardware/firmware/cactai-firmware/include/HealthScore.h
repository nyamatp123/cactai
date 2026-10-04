#pragma once

enum Mood { MOOD_HAPPY, MOOD_OK, MOOD_SAD };

float calcHealth(float moisture, float lux);   // 0-100
Mood moodFromHealth(float health);
const char* statusFromMoisture(float moisture);