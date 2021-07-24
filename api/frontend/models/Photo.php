<?php
namespace frontend\models;

use common\enums\PhotoEnum;
use common\enums\ThumbnailEnum;
use common\helpers\ImageHelper;

class Photo extends \common\models\Photo
{

    const SHOW_FIELDS = 'short_id, image, title, creator, image_info, take_date, comments_count';

    public function fields()
    {
        return [
            'id' => function () {
                return $this->short_id;
            },
            'image' => function () {
                return ImageHelper::convertToThumbnailPath(\Yii::$app->params['fileServer'] . $this->image, ThumbnailEnum::MEDIUM);
            },
            'title',
            'creator' => function () {
                return User::find()->limit(1)->select('username')->where(['id' => $this->creator])->scalar();
            },
            'width' => function () {
                return $this->image_info[ThumbnailEnum::MEDIUM]['width'] ?? 600;
            },
            'height' => function () {
                return $this->image_info[ThumbnailEnum::MEDIUM]['height'] ?? 600;
            },
            'tags' => function () {
                return $this->tags ? array_keys($this->tags) : [];
            },
            'take_date',
            'comments_count',
        ];
    }

    public static function getRecommendList($limit=20)
    {
        $query = self::find();

        $query->select(self::SHOW_FIELDS);

        // add common conditions here
        $query->andWhere(['general_status' => PhotoEnum::GENERAL_STATUS_READY]);
        $query->andWhere(['is_recommend' => 1]);
        $query->limit($limit);
        $query->orderBy('id DESC');
        return $query->all();
    }

}
