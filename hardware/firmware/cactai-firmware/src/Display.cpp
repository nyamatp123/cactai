#include "Display.h"

#define FACE_X 80
#define FACE_Y 110
#define FACE_R 60

Display::Display(uint8_t cs, uint8_t dc, uint8_t rst, uint8_t bl)
  : _tft(cs, dc, rst), _bl(bl) {}

void Display::begin() {
  pinMode(_bl, OUTPUT);
  digitalWrite(_bl, HIGH);

  _tft.init(240, 320);
  _tft.setRotation(1);               // landscape: 320 x 240
  _tft.fillScreen(ST77XX_BLACK);
}

void Display::drawFace(Mood mood) {
  uint16_t color = (mood == MOOD_HAPPY) ? ST77XX_GREEN
                 : (mood == MOOD_OK)    ? ST77XX_YELLOW
                                        : ST77XX_RED;

  // Head
  _tft.fillCircle(FACE_X, FACE_Y, FACE_R, color);

  // Eyes
  _tft.fillCircle(FACE_X - 20, FACE_Y - 15, 7, ST77XX_BLACK);
  _tft.fillCircle(FACE_X + 20, FACE_Y - 15, 7, ST77XX_BLACK);

  // Mouth (a few arcs drawn together for thickness)
  for (int r = 26; r <= 29; r++) {
    if (mood == MOOD_HAPPY) {
      _tft.drawCircleHelper(FACE_X, FACE_Y + 5, r, 0xC, ST77XX_BLACK);   // smile
    } else if (mood == MOOD_SAD) {
      _tft.drawCircleHelper(FACE_X, FACE_Y + 42, r, 0x3, ST77XX_BLACK);  // frown
    }
  }
  if (mood == MOOD_OK) {
    _tft.fillRect(FACE_X - 22, FACE_Y + 22, 44, 5, ST77XX_BLACK);        // flat mouth
  }
}

void Display::showDashboard(float moisture, float lux, float health) {
  Mood mood = moodFromHealth(health);

  // Only redraw the face when the mood changes (avoids flicker)
  if ((int)mood != _lastMood) {
    drawFace(mood);
    _lastMood = (int)mood;
  }

  char buf[24];

  // Health score
  _tft.setTextSize(4);
  _tft.setTextColor(ST77XX_WHITE, ST77XX_BLACK);
  snprintf(buf, sizeof(buf), "%3.0f%%  ", health);
  _tft.setCursor(170, 30);
  _tft.print(buf);

  _tft.setTextSize(2);
  _tft.setTextColor(ST77XX_CYAN, ST77XX_BLACK);
  _tft.setCursor(170, 70);
  _tft.print("health  ");

  // Readings
  _tft.setTextColor(ST77XX_GREEN, ST77XX_BLACK);
  snprintf(buf, sizeof(buf), "Soil %3.0f%%  ", moisture);
  _tft.setCursor(170, 110);
  _tft.print(buf);

  _tft.setTextColor(ST77XX_YELLOW, ST77XX_BLACK);
  snprintf(buf, sizeof(buf), "Lux %5.0f ", lux);
  _tft.setCursor(170, 140);
  _tft.print(buf);

  // Status line (padded so old text gets wiped)
  _tft.setTextColor(ST77XX_WHITE, ST77XX_BLACK);
  snprintf(buf, sizeof(buf), "%-18s", statusFromMoisture(moisture));
  _tft.setCursor(10, 205);
  _tft.print(buf);
}