<?php

namespace frontend\modules\user;

/**
 * user module definition class
 */
class Module extends \common\components\BaseRestModule
{
    /**
     * {@inheritdoc}
     */
    public $controllerNamespace = 'frontend\modules\user\controllers';

    /**
     * {@inheritdoc}
     */
    public function init()
    {
        parent::init();
        if (\Yii::$app instanceof \yii\console\Application) {
            $this->controllerNamespace = 'frontend\modules\user\commands';
        }

        // custom initialization code goes here

    }
}
