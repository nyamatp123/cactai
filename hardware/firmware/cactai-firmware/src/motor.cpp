#include "motor.hpp"

Motor::Motor(uint8_t pwmPin) : pwmPin_(pwmPin) {
    ledcAttach(pwmPin_, PWM_FREQ_HZ, PWM_RESOLUTION_BITS);
    ledcWrite(pwmPin_, 0);
}

void Motor::setPWM(uint8_t percent) {
    if (percent > 100) {
        percent = 100;
    }
    ledcWrite(pwmPin_, (uint32_t)percent * PWM_MAX_DUTY / 100);
}
