<?php

namespace common\filters;

use Yii;
use yii\filters\Cors;

class CorsCommon extends Cors
{

    /**
     * @var array Basic headers handled for the CORS requests.
     */
    public $cors = [
        'Origin' => ['xingmj.com', '139.198.19.132:8080', 'localhost:8080', 'http://localhost:3000'],
        'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'OPTIONS'],
        'Access-Control-Request-Headers' => ['*'],
        'Access-Control-Allow-Credentials' => null,
        'Access-Control-Max-Age' => 86400,
        'Access-Control-Expose-Headers' => [],
    ];

}
