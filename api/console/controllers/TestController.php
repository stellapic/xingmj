<?php

namespace console\controllers;

use common\models\Photo;

/**
 * 
 */
class TestController extends \yii\console\Controller
{
    
    public function actionJob()
    {
        $category = [
            'deep-space',
            'planets',
            'wild',
            'sun',
            'moon',
            'mobile',
        ];
        $startId = 0;
        do {
            $photos = Photo::find()->select('id')->limit(100)->where("id > {$startId}")->orderBy('id asc')->asArray()->all();
            foreach ($photos as $item) {
                Photo::updateAll([
                    'category' => $category[mt_rand(0, 5)],
                ], [
                    'id' => $item['id']
                ]);
                $startId = $item['id'];
            }
            echo "processed: $startId \n";
        } while ($photos);
        echo "all processed.\n";
        exit();
    }
}
