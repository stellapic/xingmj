<?php

namespace common\base;

class BaseException extends \yii\base\Exception
{
    /**
     * @return string the user-friendly name of this exception
     */
    public function getName()
    {
        return 'Base Exception';
    }
}
