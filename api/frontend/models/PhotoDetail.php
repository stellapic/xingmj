<?php
namespace frontend\models;

use common\enums\PhotoEnum;
use common\enums\ThumbnailEnum;
use common\helpers\ImageHelper;

class PhotoDetail extends \common\models\Photo
{

    public function getAuthor()
    {
        return $this->hasOne(\common\models\User::class, ['id' => 'creator']);
    }

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
            'take_date',
            'tags' => function () {
                return array_keys($this->tags);
            },
            'tags_solver' => function () {
                return $this->tags_solver ?? [];
            },
            'intro',
            'device',
            'remote_station',
            'graph_resolve',
            'graph_position',
            'thumbs_count',
            'favorites_count',
            'creator' => function () {
                return $this->author->username;
            },
            'creator_avatar' => function () {
                return $this->author->avatarUrl;
            },
            'upload_at' => function () {
                return date('Y-m-d H:i', strtotime($this->create_at));
            },
        ];
    }

}
