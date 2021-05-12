<?php
namespace common\components;

use Yii;
use common\models\sys\Config;
use yii\web\UnprocessableEntityHttpException;

/**
 * 碎片组件
 *
 * Class Debris
 * @package common\components
 * @author jianyan74 <751393839@qq.com>
 */
class Debris
{

    /**
     * 解析错误
     *
     * @param $fistErrors
     * @return string
     */
    public function analyErr($firstErrors)
    {
        if (!is_array($firstErrors) || empty($firstErrors))
        {
            return false;
        }

        $errors = array_values($firstErrors)[0];

        return $errors ?? '未捕获到错误信息';
    }
}
