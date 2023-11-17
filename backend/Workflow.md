## Переменные окружения

| Переменная              | Тип    | Описание                                                                       |
|-------------------------|--------|--------------------------------------------------------------------------------|
| PORT                    | number | Порт запуска приложения                                                        |
| SOCKET_PORT             | string | Порт для вебсокетов                                                            |
| MONGO_CONNECT           | string | URI для подключения к MongoDB                                                  |
| MONGO_NAME              | string | Название DB в MongoDB                                                          |
| CLIENT_URL              | string | URI клиента                                                                    |
| PASS_SALT_ROUNDS        | string | Количество раундов для recovery secret                                         |
| AUTH_TOKEN_SALT_ROUNDS  | string | Количество раундов для auth token                                              |
| UUID_NAMESPACE          | string | UUID namespace                                                                 |
| GLOBAL_PUBLIC_KEY       | string | Global public key для кодирования глобальных данных                            |
| GLOBAL_PRIVATE_KEY      | string | Global private key для кодирования глобальных данных                           |
