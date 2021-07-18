<?php

namespace backend\models\search;

use common\models\PhotoCategory;
use yii\data\ActiveDataProvider;

class ManagerSearch extends \common\models\User
{

    public $keyword;

    public function rules()
    {
        return [
            [['keyword'], 'safe'],
        ];
    }

    public function search($params)
    {
        $query = self::find();

        // $query->select('short_id, image, title, creator, image_info');

        // add common conditions here
        $query->andWhere(['is_manager' => 1]);

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
                ['like', 'username', $this->username],
            ]);
        }

        // echo "<pre>";
        // print_r($params);
        // echo $query->createCommand()->getRawSql();exit;
        return $dataProvider;
    }

    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'username' => '用户名',
            'email' => 'Email',
            'avatar' => '头像',
            'created_at' => '注册时间',
            'status' => '状态',
        ];
    }

}
