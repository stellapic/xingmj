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
        'Origin' => ['*'],
        'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'OPTIONS'],
        'Access-Control-Request-Headers' => ['*'],
        'Access-Control-Allow-Credentials' => null,
        'Access-Control-Max-Age' => 86400,
        'Access-Control-Expose-Headers' => [],
        'Access-Control-Allow-Headers' => ['era_tkn', ],
    ];

    /**
     * For each CORS headers create the specific response.
     * @param array $requestHeaders CORS headers we have detected
     * @return array CORS headers ready to be sent
     */
    public function prepareHeaders($requestHeaders)
    {

        if (!isset($requestHeaders['Origin'])) {
            $requestHeaders['Origin'] = 'self';
        }

        if (!isset($requestHeaders['Access-Control-Request-Method'])) {
            $requestHeaders['Access-Control-Request-Method'] = $this->cors['Access-Control-Request-Method'][0];
        }

        // if (!isset($this->cors['Access-Control-Expose-Headers'])) {
        //     $responseHeaders['Access-Control-Expose-Headers'] = implode(', ', $this->cors['Access-Control-Expose-Headers']);
        // }

        // if (isset($this->cors['Access-Control-Allow-Headers'])) {
        //     $responseHeaders['Access-Control-Allow-Headers'] = implode(', ', $this->cors['Access-Control-Allow-Headers']);
        // }

        return parent::prepareHeaders($requestHeaders);

    }

}
