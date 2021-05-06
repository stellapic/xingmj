<?php
namespace frontend\models;

class User extends \common\models\User
{
    public function fields()
    {
        $fields = parent::fields();

        // remove fields that contain sensitive information
        unset($fields['auth_key'], $fields['password_hash'], $fields['password_reset_token'], $fields['status'], $fields['jwt_value'], $fields['verification_token'], $fields['created_at'], $fields['updated_at']);

        return $fields;
    }
}
