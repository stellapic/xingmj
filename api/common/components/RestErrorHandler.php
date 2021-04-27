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
        http_response_code(200);
        header('Content-type: application/json');
        echo json_encode([
            'code' => $exception->getCode() ?: 500,
            'message' => $exception->getMessage(),
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit();
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
