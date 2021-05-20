<?php

namespace common\models;


class UserRelPhoto extends BaseModel
{

    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'user_rel_photo';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['rel_type', 'user_id', 'photo_id'], 'required'],
        ];
    }

}
