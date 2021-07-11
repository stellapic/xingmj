slides.php
<ol>
    <?php
        foreach ($slides as $key =>$value) {
            echo "<li>";
            foreach ($value as $k => $v) {
                switch ($k) {
                    case 'image':
                        echo '<img style="width:600px;" src="' . $v . '" />';
                        break;
                    case 'redirect_url':
                        echo '<input type="text" name="redirect_url" value="' . $v . '" />';
                        break;
                    case 'text':
                        echo '<input type="text" name="text" value="' . $v . '" />';
                        break;
                    case 'sort':
                        echo '<input type="text" name="sort" value="' . $v . '" />';
                        break;
                    default:
                        # code...
                        break;
                }
            }
            echo "</li>";
        }
    ?>
</ol>
