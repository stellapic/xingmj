<?php

namespace common\models;

use Yii;
use Hidehalo\Nanoid\Client as NanoIdClient;

/**
 * The base model class
 */
class BaseModel extends \yii\db\ActiveRecord
{

    public function getNanoId()
    {
        $client = new NanoIdClient(9);
        return $client->generateId();
    }
}
