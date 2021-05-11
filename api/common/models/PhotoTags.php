<?php

namespace common\models;


class PhotoTags extends BaseModel
{

    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'photo_tags';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['tag_name', 'tag_title'], 'required'],
        ];
    }

}
