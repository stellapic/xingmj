<?php

namespace backend\models\search;

use common\models\PhotoCategory;
use yii\data\ActiveDataProvider;

class PhotoCategorySearch extends PhotoCategory
{

    public $keyword, $tag;

    public function rules()
    {
        return [
            [['keyword', 'category', 'tag'], 'safe'],
        ];
    }

    public function search($params)
    {
        $query = self::find();

        // $query->select('short_id, image, title, creator, image_info');

        // add common conditions here
        // $query->andWhere(['general_status' => PhotoEnum::GENERAL_STATUS_READY]);

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
            'pagination' => [
                'page' => isset($params['page']) ? (int)$params['page'] - 1 : 0,
                'pageSize' => isset($params['size']) ? (int)$params['size'] : 20,
            ],
            'sort' => [
                'defaultOrder' => [
                    'id' => SORT_DESC,
                ],
            ]
        ]);

        $this->setAttributes($params);

        $shouldReturnEmpty = !$this->validate();
        if ($shouldReturnEmpty) {
            // uncomment the following line if you do not want to return any records when validation fails
            $query->where('0=1');
            // p($this->getErrors());exit;
            return $dataProvider;
        }

        if ($this->keyword) {
            $query->andFilterWhere([
                'OR',
                ['like', 'category_title', $this->category_title],
                ['like', 'category_name', $this->category_name],
            ]);
        }

        // echo "<pre>";
        // print_r($params);
        // echo $query->createCommand()->getRawSql();exit;
        return $dataProvider;
    }

    public function fields()
    {
        return [
            'id',
            'category_name',
            'category_title',
        ];
    }

}
