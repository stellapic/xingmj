<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "photo_comment".
 *
 * @property int $id
 * @property int|null $photo_id 图片id
 * @property int|null $user_id 用户名
 * @property string|null $content 评论内容
 * @property string|null $created_at 创建时间
 */
class PhotoComment extends BaseModel
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'photo_comment';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['photo_id', 'user_id'], 'integer'],
            [['created_at'], 'safe'],
            [['content'], 'string', 'max' => 500],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'photo_id' => 'Photo ID',
            'user_id' => 'User ID',
            'content' => 'Content',
            'created_at' => 'Created At',
        ];
    }
}