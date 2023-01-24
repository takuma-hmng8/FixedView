<?php

/*
=====================================================================
=====================================================================
robots
=====================================================================
=====================================================================
*/

function metaRobotSet(){
    $metaRobotStates = "none";
    // $metaRobotStates = "index, follow";
    if( is_home() || is_front_page() ){
        echo $metaRobotStates;
    }elseif(is_404()){
        echo "none";
    }elseif(is_page("thanks")){
        echo "none";
    }elseif(is_search()){
        echo "none";
    }elseif(is_tax()){
        echo "none";
    }elseif(is_archive()){
        echo $metaRobotStates;
    }elseif(is_page() || is_single()){
        echo $metaRobotStates;
    }
}

/*
=====================================================================
=====================================================================
OGPの設定
=====================================================================
=====================================================================
*/

//OGP画像のURL
function metaOGPSet(){
    $home_url = get_template_directory_uri();
    $mainOGP = "${home_url}/assets/images/ogp.jpg";
    if( is_home() || is_front_page() ){
        echo $mainOGP;
    }elseif(is_single() && get_the_post_thumbnail()){
        echo the_post_thumbnail_url( 'full' );
    }else{
        echo $mainOGP;
    }
}

//Twitter cardの設定
function metaTwitterCard(){
    echo "summary_large_image";
}

/*
=====================================================================
=====================================================================
faviconの設定
=====================================================================
=====================================================================
*/

function metaFavicon(){
    $home_url = get_template_directory_uri();
    echo "${home_url}/assets/images/element/logo/favicon.ico";
}
function metaAppletouchIcon(){
    $home_url = get_template_directory_uri();
    echo "${home_url}/assets/images/element/logo/apple-touch-icon.png";
}

/*
=====================================================================
=====================================================================
タイトルの設定
=====================================================================
=====================================================================
*/

function metaTitleSet(){
    //top
    $siteTitle = get_bloginfo( 'name' );
    
    //固定・シングル
    $pageTitle = get_the_title();
    
    //カスタム投稿アーカイブ
    $postTypeSlug = get_post_type();
    $postType = get_post_type_object($postTypeSlug);
    $postTypeTitle = $postType->labels->name;
    
    //タクソノミーアーカイブ
    $taxonomyObj = get_queried_object();
    $taxonomyTax = $taxonomyObj->taxonomy;
    $taxonomyTitle = $taxonomyObj->name;
    
    //検索結果
    $searchQuery = get_search_query();
    
    //404
    $notfoundTitle = "お探しのページは見つかりませんでした。";

    if( is_home() || is_front_page() ){
        echo $siteTitle;
    }elseif(is_404()){
        echo "${notfoundTitle} | ${siteTitle}";
    }elseif(is_search()){
        echo "${searchQuery}の検索結果 | ${siteTitle}";
    }elseif(is_tax($taxonomyTax)){
        echo "${taxonomyTitle} | ${siteTitle}";
    }elseif(is_archive($postType)){
        echo "${postTypeTitle} | ${siteTitle}";
    }elseif(is_page() || is_single()){
        echo "${pageTitle} | ${siteTitle}";
    }
}

/*
=====================================================================
=====================================================================
ディスクリプションの設定
=====================================================================
=====================================================================
*/

function metaDescriptionSet(){    
    //top
    $siteDescription = get_bloginfo( 'description' );
    
    //固定・シングル
    if( get_post_meta(get_the_ID(), 'meta_description', true) ){
        $pageDescription = htmlspecialchars(get_post_meta(get_the_ID(), 'meta_description', true));
    }else{
        $pageDescription = $siteDescription;
    }
    
    //カスタム投稿アーカイブ
    $postTypeSlug = get_post_type();
    $postType = get_post_type_object($postTypeSlug);
    if($postType->description == null){
        $postTypeDescription = $siteDescription;
    }else{
        $postTypeDescription = $postType->description;
    }
    
    //タクソノミーアーカイブ
    $taxonomyObj = get_queried_object();
    $taxonomyTax = $taxonomyObj->taxonomy;
    if($taxonomyObj->description == null){
        $taxonomyDescription = $siteDescription;
    }else{
        $taxonomyDescription = $taxonomyObj->description;
    }
    
    //検索結果
    $searchQuery = get_search_query();
    $searchDescription = "${searchQuery}の検索結果を表示しています。";
    
    //404
    $notfoundDescription = "お探しのページは見つかりませんでした。一時的にアクセス出来ない状態か、移動もしくは削除されてしまった可能性があります。";

    if( is_home() || is_front_page() ){
        echo $siteDescription;
    }elseif(is_404()){
        echo $notfoundDescription;
    }elseif(is_search()){
        echo $searchDescription;
    }elseif(is_tax($taxonomyTax)){
        echo $taxonomyDescription;
    }elseif(is_archive($postType)){
        echo $postTypeDescription;
    }elseif(is_page() || is_single()){
        echo $pageDescription;
    }
}

/*
=====================================================================
=====================================================================
現在のURL取得
=====================================================================
=====================================================================
*/

function nowUrl(){
    $url = '';
    if(isset($_SERVER['HTTPS'])){
        $url .= 'https://';
    }else{
        $url .= 'http://';
    }
    $url .= $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    return $url;
}

?>
<meta format-detection="telephone=no">
<!-- robots -->
<meta name="robots" content="<?php metaRobotSet(); ?>">
<!-- meta -->
<title><?php metaTitleSet(); ?></title>
<meta name="description" content="<?php metaDescriptionSet(); ?>" />
<link rel="canonical" href="<?php echo nowUrl(); ?>">
<meta name="keywords" content="">
<!-- OGP -->
<meta property="og:type" content="website" />
<meta property="og:title" content="<?php metaTitleSet(); ?>" />
<meta property="og:description" content="<?php metaDescriptionSet(); ?>" />
<meta property="og:image" content="<?php echo metaOGPSet(); ?>">
<meta property="og:url" content="<?php echo nowUrl(); ?>" />
<meta property="og:image:secure_url" content="<?php echo metaOGPSet(); ?>" />
<meta property="og:site_name" content="<?php metaDescriptionSet(); ?>" />
<meta property="og:locale" content="ja_JP" />
<!-- twitter card -->
<meta name="twitter:card" content="<?php metaTwitterCard(); ?>" />
<meta name="twitter:title" content="<?php metaTitleSet(); ?>" />
<meta name="twitter:description" content="<?php metaDescriptionSet(); ?>" />
<meta name="twitter:image" content="<?php echo metaOGPSet(); ?>" />
<!-- facebook card -->
<!-- <meta name="facebook-domain-verification" content="" /> -->
<!-- favicon -->
<link rel="icon" href="<?php metaFavicon(); ?>">
<link rel="apple-touch-icon" sizes="72x72" href="<?php metaAppletouchIcon(); ?>">
<!-- hreflang -->
<!-- <link rel="alternate" hreflang="ここに言語コードを記述" href="その言語で書かれたページのURLを記述"> -->
<!-- Google Tag Manager -->
<!-- // Google Tag Manager -->