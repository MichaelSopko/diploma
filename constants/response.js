module.exports = {
    NOT_ENOUGH_PARAMS : 'Not enough incoming parameters',
    NOT_VALID_PASS    : 'Некоректний пароль. Пароль повинен бути довжиною 6-24 символів і складатись з: A-Z, a-z, 0-9',
    NOT_VALID_NAME    : 'Логін може містити наступні символи: A-Z, a-z',
    NOT_VALID_EMAIL   : 'Email field should contain a valid email address',
    NOT_ALLOW_FOR_ROLE: 'Not allow for this role!',

    ON_ACTION: {
        DUPLICATE_USER: 'User with such name or email already exists',
        NOT_FOUND     : 'Not found ',
        NOT_FOUND_USER: 'Користувача не знайдено'
    },

    AUTH: {
        INVALID_CREDENTIALS: 'Неправильний логін або пароль',
        UN_AUTHORIZED      : 'Unauthorized',
        LOG_IN             : 'Login successful',
        LOG_OUT            : 'Logout successful',
        NO_PERMISSIONS     : 'Access denied'
    }
};