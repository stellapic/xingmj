<?php

namespace common\models;


class Photo extends BaseModel
{

    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'photo';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['photo_url', 'title', 'category'], 'required'],
            [['photo_url', 'title', 'take_place', 'intro', 'graph_resolve', 'graph_position'], 'string', 'max' => 255],
        ];
    }

}
