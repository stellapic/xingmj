
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title><?=Yii::$app->params['appName'] ?>管理后台<?= $this->params['title'] ? ' | ' . $this->params['title'] : '' ?></title>
  <!-- Tell the browser to be responsive to screen width -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="/adminlte/plugins/fontawesome-free/css/all.min.css">
  <!-- Ionicons -->
  <link href="https://cdn.bootcdn.net/ajax/libs/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet">
  <!-- Theme style -->
  <link rel="stylesheet" href="/adminlte/dist/css/adminlte.min.css">
  <link rel="stylesheet" href="/static/css/common.css">
  <!-- Select2 -->
  <link rel="stylesheet" href="/adminlte/plugins/select2/css/select2.min.css">
  <!-- Google Font: Source Sans Pro -->
  <!-- <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet"> -->
  <style type="text/css">
    .pagination-container {clear: both;display: block;height: 42px;line-height: 1;}
    .pagination-container>div {float: right; display: block;}
    .pagination-container>.pagination>li {
      border: 1px solid #ddd;
      border-radius: 4px;
      margin: 0 1px;
    }
    .pagination-container>.pagination>li>a,span {    display: block;
    padding: 5px 8px;
    }
    .pagination-container>.pagination>li>a:hover {
      background: rgba(0,0,0,.075);
    }
    .pagination-container>.pagination>li.active {
      background: #ddd;
    }
    .pagination-container>.pagination>li.active>a {
      color: #333;
      cursor: default;
    }
    .form-control-navbar+.input-group-append>.btn-navbar,
    input.form-control.form-control-navbar {
        background-color: #f5f5f5;
        border-color: #e8e8e8;
        color: rgba(52,58,64,.8);
    }
    /*toastr*/
    .toasts-top-right.fixed {
      min-width: 300px;
    }
    /*rewrite*/
    a.disabled {
      color: #aaa;
    }
    a.tooltips {
        margin: 0 2px;
    }
  </style>
</head>
<body class="hold-transition sidebar-mini layout-navbar-fixed text-sm sidebar-collapse" style="height: auto; min-height: 100%;">
<div class="wrapper">
  <!-- Navbar -->
  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#"><i class="fas fa-bars"></i></a>
      </li>
      <li class="nav-item d-none d-sm-inline-block">
        <a href="/" class="nav-link">首页</a>
      </li>
      <li class="nav-item d-none d-sm-inline-block">
        <a href="/photo?is_recommend=1" class="nav-link">精选图片</a>
      </li>
    </ul>

    <!-- SEARCH FORM -->
    <form class="form-inline ml-3" action="/photo">
      <div class="input-group input-group-sm">
        <input class="form-control form-control-navbar" name="keyword" type="search" placeholder="搜索图片" aria-label="Search" value="<?= \Yii::$app->request->get('keyword') ?>">
        <div class="input-group-append">
          <button class="btn btn-navbar" type="submit">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </form>

    <!-- Right navbar links -->
    <ul class="navbar-nav ml-auto">
      <!-- Messages Dropdown Menu -->
      <li class="nav-item dropdown">
        <a class="nav-link" data-toggle="dropdown" href="#">
          <i class="far fa-comments"></i>
          <span class="badge badge-danger navbar-badge">3</span>
        </a>
        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          <a href="#" class="dropdown-item">
            <!-- Message Start -->
            <div class="media">
              <img src="/adminlte/dist/img/user1-128x128.jpg" alt="User Avatar" class="img-size-50 mr-3 img-circle">
              <div class="media-body">
                <h3 class="dropdown-item-title">
                  Brad Diesel
                  <span class="float-right text-sm text-danger"><i class="fas fa-star"></i></span>
                </h3>
                <p class="text-sm">Call me whenever you can...</p>
                <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>
              </div>
            </div>
            <!-- Message End -->
          </a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item">
            <!-- Message Start -->
            <div class="media">
              <img src="/adminlte/dist/img/user8-128x128.jpg" alt="User Avatar" class="img-size-50 img-circle mr-3">
              <div class="media-body">
                <h3 class="dropdown-item-title">
                  John Pierce
                  <span class="float-right text-sm text-muted"><i class="fas fa-star"></i></span>
                </h3>
                <p class="text-sm">I got your message bro</p>
                <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>
              </div>
            </div>
            <!-- Message End -->
          </a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item">
            <!-- Message Start -->
            <div class="media">
              <img src="/adminlte/dist/img/user3-128x128.jpg" alt="User Avatar" class="img-size-50 img-circle mr-3">
              <div class="media-body">
                <h3 class="dropdown-item-title">
                  Nora Silvester
                  <span class="float-right text-sm text-warning"><i class="fas fa-star"></i></span>
                </h3>
                <p class="text-sm">The subject goes here</p>
                <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>
              </div>
            </div>
            <!-- Message End -->
          </a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item dropdown-footer">See All Messages</a>
        </div>
      </li>
      <!-- Notifications Dropdown Menu -->
      <li class="nav-item dropdown">
        <a class="nav-link" data-toggle="dropdown" href="#">
          <i class="far fa-bell"></i>
          <span class="badge badge-warning navbar-badge">15</span>
        </a>
        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          <span class="dropdown-item dropdown-header">15 Notifications</span>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item">
            <i class="fas fa-envelope mr-2"></i> 4 new messages
            <span class="float-right text-muted text-sm">3 mins</span>
          </a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item">
            <i class="fas fa-users mr-2"></i> 8 friend requests
            <span class="float-right text-muted text-sm">12 hours</span>
          </a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item">
            <i class="fas fa-file mr-2"></i> 3 new reports
            <span class="float-right text-muted text-sm">2 days</span>
          </a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item dropdown-footer">See All Notifications</a>
        </div>
      </li>
      <!-- <li class="nav-item">
        <a class="nav-link" data-widget="control-sidebar" data-slide="true" href="#" role="button">
          <i class="fas fa-th-large"></i>
        </a>
      </li> -->
      <li class="nav-item">
        <a class="nav-link" href="/site/logout">
          <i class="fas fa-sign-out-alt"></i>
        </a>
      </li>
    </ul>
  </nav>
  <!-- /.navbar -->

  <!-- Main Sidebar Container -->
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="/" class="brand-link">
      <img src="/adminlte/dist/img/AdminLTELogo.png"
           alt="<?=Yii::$app->params['appName'] ?> Logo"
           class="brand-image img-circle elevation-3"
           style="opacity: .8">
      <span class="brand-text font-weight-light"><?=Yii::$app->params['appName'] ?></span>
    </a>

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar user (optional) -->
      <div class="user-panel mt-3 pb-3 mb-3 d-flex">
        <div class="image">
          <img src="<?= Yii::$app->user->getIdentity()->avatarUrl ?>" class="img-circle elevation-2" alt="User Image">
        </div>
        <div class="info">
          <a href="javascript:void(0);" class="d-block"><?= Yii::$app->user->getIdentity()->username ?></a>
        </div>
      </div>

      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column nav-flat nav-legacy" data-widget="treeview" role="menu" data-accordion="false">
          <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->

          <li class="nav-item">
            <a href="/home/slides" class="nav-link">
              <i class="nav-icon fas fa-home"></i>
              <p>
                首页轮播图
                <!-- <span class="right badge badge-danger">New</span> -->
              </p>
            </a>
          </li>
          <li class="nav-item has-treeview menu-open">
            <a href="#" class="nav-link">
              <i class="nav-icon fas fa-images"></i>
              <p>
                图片管理
                <i class="right fas fa-angle-left"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                <a href="/photo" class="nav-link">
                  <i class="far fa-image nav-icon"></i>
                  <p>图片列表</p>
                  <!-- 精选列表 -->
                </a>
              </li>
              <li class="nav-item">
                <a href="/photo-category" class="nav-link">
                  <i class="far fa-folder nav-icon"></i>
                  <p>类别管理</p>
                </a>
              </li>
              <li class="nav-item">
                <a href="#/adminlte/index3.html" class="nav-link">
                  <i class="fas fa-hashtag nav-icon"></i>
                  <p>标签管理</p>
                </a>
              </li>
              <li class="nav-item">
                <a href="#/adminlte/index3.html" class="nav-link">
                  <i class="fas fa-laptop-code nav-icon"></i>
                  <p>远程台管理</p>
                </a>
              </li>
              <li class="nav-item">
                <a href="/photo-comment" class="nav-link">
                  <i class="far fa-comments nav-icon"></i>
                  <p>图片评论</p>
                </a>
              </li>
            </ul>
          </li>
          <li class="nav-item has-treeview menu-open">
            <a href="#" class="nav-link">
              <i class="nav-icon fas fa-cogs"></i>
              <p>
                系统管理
                <i class="right fas fa-angle-left"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                <a href="/managers" class="nav-link">
                  <i class="fas fa-user nav-icon"></i>
                  <p>管理员列表</p>
                </a>
              </li>
              <li class="nav-item">
                <a href="/members" class="nav-link">
                  <i class="fas fa-users nav-icon"></i>
                  <p>普通用户列表</p>
                </a>
              </li>
              <li class="nav-item">
                <a href="#settings" class="nav-link">
                  <i class="fas fa-cog nav-icon"></i>
                  <p>系统设置</p>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
  </aside>

  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper" style="overflow: auto;">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1><?= $this->params['title'] ?></h1>
          </div>

          <div class="col-sm-6">
            <!-- <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">Icons</li>
            </ol> -->
            <!-- <form class="form-inline ml-3">
              <div class="input-group input-group-sm">
                <input class="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search">
                <div class="input-group-append">
                  <button class="btn btn-navbar" type="submit">
                    <i class="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </form> -->
          </div>
        </div>
      </div><!-- /.container-fluid -->
    </section>

    <!-- Main content -->
    <!-- jQuery -->
    <script src="/adminlte/plugins/jquery/jquery.min.js"></script>
    <script src="/static/js/common.js"></script>
    <section class="content">
      <div class="container-fluid">
                <?= $content ?>
              </div>
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
  <footer class="main-footer text-sm">
    <div class="float-right d-none d-sm-block">
      <!-- <b>Version</b> 3.0.0 -->
    </div>
    <strong>Copyright &copy; 2021 xingmj.com.</strong> All rights
    reserved.
  </footer>

  <!-- Control Sidebar -->
  <aside class="control-sidebar control-sidebar-dark">
    <!-- Control sidebar content goes here -->
    <?php // include 'sidebar.php' ?>
  </aside>
  <!-- /.control-sidebar -->
</div>
<!-- ./wrapper -->

<!-- Select2 -->
<script src="/adminlte/plugins/select2/js/select2.full.min.js"></script>
<!-- Bootstrap 4 -->
<script src="/adminlte/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- AdminLTE App -->
<script src="/adminlte/dist/js/adminlte.min.js"></script>
<!-- AdminLTE for demo purposes -->
<!-- <script src="/adminlte/dist/js/demo.js"></script> -->
<script type="text/javascript">
$(function() {
  // list select-all
  $('input[name="id_all"]').click(function() {
    $('input[name="id[]"]').trigger('click');
  });
  // add tooltip
  $('.tooltips').tooltip()
  //ajax post请求添加X-CSRF-Token
  $(document).ajaxSend(function(a, b, c) {
    if (c.type == 'POST') {
        b.setRequestHeader('X-CSRF-Token', '<?=  Yii::$app->request->csrfToken; ?>');
    }
  });
});
</script>

</body>
</html>
