<?php

use yii\db\Migration;

class m_create_user extends Migration
{
    public function up()
    {
        $transaction = $this->getDb()->beginTransaction();
        $user = \Yii::createObject([
            'class'    => \common\models\User::class,
            'scenario' => 'create',
            'email'    => 'admin',
            'username' => 'eson@xingmj.com',
            'password' => 'helloeson',
        ]);
        if (!$user->insert(false)) {
            $transaction->rollBack();
            return false;
        }
        $user->confirm();
        $transaction->commit();
    }
}
