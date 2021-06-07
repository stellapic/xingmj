<?php
namespace common\components;

/**
 * Base errorHandler for rest modules
 */
class RestErrorHandler extends \yii\base\ErrorHandler
{

    protected function renderException($exception)
    {
        $this->recordLog([
            'code' => $exception->getCode() ?: 500,
            'message' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
        ]);

        $response = \Yii::$app->getResponse();
        $response->setStatusCode(200);
        $response->format = $response::FORMAT_JSON;
        $response->content = json_encode([
            'code' => 500,
            'message' => $exception->getMessage(),
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $response->off('beforeSend'); // reserve original response headers.
        $response->send();
        exit;
    }

    private function recordLog($exception)
    {
        if (empty(\Yii::$app->params['logPath'])) {
            return;
        }

        $data = [
            'req_time' => date('Y-m-d H:i:s'),
            'req_method' => \Yii::$app->request->getMethod(),
            'req_url' => \Yii::$app->request->getHostInfo() . \Yii::$app->request->getUrl(),
            'req_params' => \Yii::$app->request->getRawBody(),
            'exception' => $exception,
        ];

        $dirname = \Yii::$app->params['logPath'] . date('Ym') . '/';
        if (!file_exists($dirname)) {
            mkdir($dirname, 0755);
        }

        $filename = $dirname . date('Ymd') . '.log';
        file_put_contents($filename, json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND);
    }
}
