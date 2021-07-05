<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "photo_category".
 *
 * @property int $id
 * @property string|null $category_name 类别名称，搜索用
 * @property string|null $category_title 类别名称
 */
class PhotoCategory extends BaseModel
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'photo_category';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['category_name'], 'string', 'max' => 20],
            [['category_title'], 'string', 'max' => 50],
            [['category_name'], 'unique'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'category_name' => 'Category Name',
            'category_title' => 'Category Title',
        ];
    }
}