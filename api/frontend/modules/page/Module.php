<?php

namespace frontend\modules\page;

/**
 * page module definition class
 */
class Module extends \common\components\BaseRestModule
{
    /**
     * {@inheritdoc}
     */
    public $controllerNamespace = 'frontend\modules\page\controllers';

    /**
     * {@inheritdoc}
     */
    public function init()
    {
        parent::init();
        if (\Yii::$app instanceof \yii\console\Application) {
            $this->controllerNamespace = 'frontend\modules\page\commands';
        }

        // custom initialization code goes here

    }
}
