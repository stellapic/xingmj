<?php

use yii\db\Migration;

/**
 * Class m210428_014547_user_extends
 */
class m210428_014547_user_extends extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->addColumn('{{%user}}', 'intro', $this->string(200)->defaultValue(null)->comment('个人简介'));
        $this->addColumn('{{%user}}', 'follow_count', $this->integer()->defaultValue(0)->comment('关注数量'));
        $this->addColumn('{{%user}}', 'fans_count', $this->integer()->defaultValue(0)->comment('关注数量'));
        $this->addColumn('{{%user}}', 'thumbs_count', $this->integer()->defaultValue(0)->comment('获赞数量'));
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        echo "m210428_014547_user_extends cannot be reverted.\n";

        return false;
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m210428_014547_user_extends cannot be reverted.\n";

        return false;
    }
    */
}
