<?php

use yii\db\Migration;

/**
 * Class m210427_104017_update_pwd
 */
class m210427_104017_update_pwd extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $user = \common\models\User::findOne(2);
        $user->setPassword('eson');
        $user->save();
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m210427_104017_update_pwd cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m210427_104017_update_pwd cannot be reverted.\n";

        return false;
    }
    */
}
