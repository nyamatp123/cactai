#include "motor.hpp"

Motor::Motor(uint8_t pwmPin) : pwmPin_(pwmPin) {
    ledcSetup(PWM_CHANNEL, PWM_FREQ_HZ, PWM_RESOLUTION_BITS);
    ledcAttachPin(pwmPin_, PWM_CHANNEL);
    ledcWrite(PWM_CHANNEL, 0);
}

void Motor::setPWM(uint8_t percent) {
    if (percent > 100) {
        percent = 100;
    }
    ledcWrite(PWM_CHANNEL, (uint32_t)percent * PWM_MAX_DUTY / 100);
}
