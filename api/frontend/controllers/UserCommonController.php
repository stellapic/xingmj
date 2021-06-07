<?php
namespace frontend\controllers;

use Yii;
use Firebase\JWT\JWT;
use frontend\models\SignupForm;

class UserCommonController extends BaseJwtController
{

    public $noAuthActions = ['login', 'signup'];

    public function actionInfo($username='')
    {
        if ($username) {
            return $this->getRequestedUser($username);
        }
        return Yii::$app->user->identity;
    }

    public function actionProfile($username='')
    {
        if ($username) {
            $user = $this->getRequestedUser($username);
        } else {
            /**
             * @var  \frontend\models\User $user
             */
            $user = Yii::$app->user->identity;
        }

        $attrs = [
            'avatar' => Yii::$app->request->post('avatar'),
            'intro' => Yii::$app->request->post('intro'),
        ];
        $user->updateAttributes($attrs);
    }

    /**
     * jwt login
     */
    public function actionLogin()
    {

        $username = Yii::$app->request->post('username');
        $password = Yii::$app->request->post('password');

        $jwt = $this->autoLogin($username, $password);

        return [
            'era_tkn' => $jwt,
        ];
    }

    public function actionSignup()
    {
        $model = new SignupForm();
        $model->setAttributes(Yii::$app->request->post());
        if (!$model->signup()) {
            throw new \yii\base\UserException(current($model->getFirstErrors()));
        }
        $jwt = $this->autoLogin($model->username, $model->password);
        return [
            'era_tkn' => $jwt,
        ];
    }

    private function autoLogin($username, $password)
    {
        $result = \common\models\User::find()->where(['username' => $username, 'status' => \common\models\User::STATUS_ACTIVE])->asArray()->one();

        if(!$result || !Yii::$app->getSecurity()->validatePassword($password, $result['password_hash'])) {
            throw new \yii\base\UserException('Wrong username or password.');
        }

        $tokenId    = base64_encode(random_bytes(32));
        $issuedAt   = time();
        $notBefore  = $issuedAt;             //Adding 10 seconds
        $expire     = $notBefore + Yii::$app->params['JWTExpiration'];            // Adding 180 Days
        $serverName = 'xingmj';
        $data = [
            'iat'  => $issuedAt,         // Issued at: time when the token was generated
            'jti'  => $tokenId,          // Json Token Id: an unique identifier for the token
            'iss'  => $serverName,       // Issuer
            'nbf'  => $notBefore,        // Not before
            'exp'  => $expire,           // Expire
            'data' => [                  // Data related to the signer user
                'id' => $result['id'],
                'username' => $result['username'],
                'email' => $result['email'],
                // 'avatar' => $result['avatar'],
                // 'intro' => $result['intro'],
                // 'follow_count' => $result['follow_count'],
                // 'fans_count' => $result['fans_count'],
                // 'thumbs_count' => $result['thumbs_count'],
            ]
        ];

        $jwt = JWT::encode(
            $data,
            Yii::$app->params['JWTKey'], 
            'HS512'
        );

        // invalidate other jwts
        \common\models\User::updateAll([
            'jwt_value' => crc32($jwt),
        ], [
            'id' => $result['id'],
        ]);

        return $jwt;
    }
}
