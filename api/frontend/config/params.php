<?php
return [
    'adminEmail' => 'admin@example.com',
    'logPath' =>  \Yii::getAlias('@frontend') . '/runtime/logs/',
    'JWTKey' => 'helloworldhelloreally',
    'JWTExpiration' => 15552000, // Adding 180 Days
    'queueName' => [
        'solver_pending' => 'queue:solver:pending',
        'solver_done' => 'queue:solver:done',
    ]
];
