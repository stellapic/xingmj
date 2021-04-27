<?php

use yii\db\Migration;

/**
 * Class m210427_103301_user
 */
class m210427_103301_user extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $user = \Yii::createObject([
            'class'    => \common\models\User::class,
            'scenario' => 'create',
            'email'    => 'admin@xingmj.com',
            'username' => 'tc',
            'password' => 'tc',
            'auth_key' => 'helloworld',
        ]);
        if (!$user->insert(false)) {
            return false;
        }
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m210427_103301_user cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m210427_103301_user cannot be reverted.\n";

        return false;
    }
    */
}
