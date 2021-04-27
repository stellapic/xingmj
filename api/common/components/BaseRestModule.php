<?php

namespace common\components;

/**
 * base module for rest modules
 */
class BaseRestModule extends \yii\base\Module
{
    /**
     * {@inheritdoc}
     */
    public function init()
    {
        parent::init();

        // custom initialization code goes here

        \Yii::configure($this, [

            'components' => [

                'errorHandler' => [

                    'class' => \common\components\RestErrorHandler::class,

                ]

            ],

        ]);

        /** @var \common\components\RestErrorHandler $handler */

        $handler = $this->get('errorHandler');

        \Yii::$app->set('errorHandler', $handler);

        $handler->register();
    }
}
