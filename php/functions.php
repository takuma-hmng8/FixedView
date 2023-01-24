<?php

/*
=====================================================================
=====================================================================
common
=====================================================================
=====================================================================
*/

// wp_headの余白をなくす
add_filter( 'show_admin_bar', '__return_false' );


/*
=====================================================================
=====================================================================
サムネイル
=====================================================================
=====================================================================
*/
add_theme_support('post-thumbnails');
function defaultThumbnail( $post_id ) {
    $postThumbnail = get_post_meta( $post_id, $key = '_thumbnail_id', $single = true );
    $defaultThumbnail_id = '32';
    if ( !wp_is_post_revision( $post_id ) ) {
        if ( empty( $postThumbnail ) ) {
            update_post_meta( $post_id, $meta_key = '_thumbnail_id', $meta_value = $defaultThumbnail_id );
        }
    }
}
add_action( 'save_post', 'defaultThumbnail' );



/*
=====================================================================
=====================================================================
同じ日付でも日付を表示
=====================================================================
=====================================================================
*/

function postDate() {
    global $previousday;
    $previousday = '';
}
add_action( 'the_post', 'postDate' );


/*
=====================================================================
=====================================================================
不要な設定を削除
=====================================================================
=====================================================================
*/
//不要なコードを読み込ませない
add_action('wp_enqueue_scripts', function() {
	if (!is_admin()) {
		wp_deregister_style('wp-block-library');
		wp_deregister_script('jquery');
		wp_dequeue_style('global-styles');
	}
});  

// WordPressバージョン出力metaタグ非表示
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');

// RSSフィード無効化
remove_action('do_feed_rdf', 'do_feed_rdf');
remove_action('do_feed_rss', 'do_feed_rss');
remove_action('do_feed_rss2', 'do_feed_rss2');
remove_action('do_feed_atom', 'do_feed_atom');

// コメントを廃止
add_filter( 'comments_open', '__return_false');
add_action( 'admin_menu', 'removeComment' );
function removeComment(){
    remove_menu_page( 'edit-comments.php' );
}

// バージョンを隠す
function remove_version() {
    return '';
}
add_filter('the_generator', 'removeVersion');

function removeCssjsVer2( $src ) {
    if ( strpos( $src, 'ver=' ) )
        $src = remove_query_arg( 'ver', $src );
    return $src;
}
add_filter( 'style_loader_src', 'removeCssjsVer2', 9999 );
add_filter( 'script_loader_src', 'removeCssjsVer2', 9999 );

// 絵文字機能の削除
function disableEmoji() {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
}
add_action('init', 'disableEmoji');

/*
=====================================================================
=====================================================================
投稿
=====================================================================
=====================================================================
*/

//srcset属性の削除
add_filter( 'wp_calculate_image_srcset_meta', '__return_null' );


// 投稿のimgからpタグを削除
function removePonImages($content){
	return preg_replace('/<p>(\s*)(<img .* \/>)(\s*)<\/p>/iU', '\2', $content);
}
add_filter('the_content', 'removePonImages');


//投稿を管理画面から削除
add_action( 'admin_menu', 'removePost' );
function removePost(){
	remove_menu_page( 'edit.php' );
}


//固定ページの名前変更
function changePostLabel( $labels ) {
	foreach ( $labels as $key => $value ) {
		$labels->$key = str_replace( '固定ページ', 'その他固定ページ', $value );
	}

	return $labels;
}
add_filter( 'post_type_labels_page', 'changePostLabel' );

/*
=====================================================================
=====================================================================
is_mobileがtureの時はスマホ、falseの時はタブレットとPC
=====================================================================
=====================================================================
*/
function is_mobile() {
    $useragents = array(
        'iPhone',          // iPhone
        'iPod',            // iPod touch
        '^(?=.*Android)(?=.*Mobile)', // 1.5+ Android
        'dream',           // Pre 1.5 Android
        'CUPCAKE',         // 1.5+ Android
        'blackberry9500',  // Storm
        'blackberry9530',  // Storm
        'blackberry9520',  // Storm v2
        'blackberry9550',  // Storm v2
        'blackberry9800',  // Torch
        'webOS',           // Palm Pre Experimental
        'incognito',       // Other iPhone browser
        'webmate'          // Other iPhone browser
    );
    $pattern = '/'.implode('|', $useragents).'/i';
    return preg_match($pattern, $_SERVER['HTTP_USER_AGENT']);
}


/*
=====================================================================
=====================================================================
カスタム投稿タイプ設定
=====================================================================
=====================================================================
*/

function registerPostandTaxonomy() {
	$support = array(
		'title',
		'custom-fields',
		'thumbnail',
    'editor',
    'page-attributes',
	);

  register_post_type(
		'post_type',
		array(
			'label' => 'post_type',
			'description' => 'hogehogehoge',
			'public' => true,
      // 個別ページを生成しない場合は以下を追加
      //'public' => false,
      //'show_ui' => true,
			'supports' => $support,
			'has_archive' => true,
			'menu_position' =>4,
			'show_in_rest' => true,
	));

	register_taxonomy(
		'taxonomy_name',
		'post_type',
		array(
			'labels' => array(
			'name' => 'hogehoge',
			'add_new_item' => 'hogehogeを追加',
			'edit_item' => 'hogehogeの編集',
		),
		'hierarchical' => true,
		'show_admin_column' => true,
		'rewrite' => array('with_front' => false,'slug' => 'hogehogehoge'),
		'show_ui' => true,
		'show_in_rest' => true,
		)
	);
  //カスタムタクソノミーのアーカイブのURLの構造を変更する場合
  register_taxonomy(
      'column_category',
      'column',
      array(
        'labels' => array(
        'name' => '健康コラムカテゴリ',
        'add_new_item' => '健康コラムを追加',
        'edit_item' => '健康コラムの編集',
      ),
      'hierarchical' => true,
      'show_admin_column' => true,
      'rewrite' => array('with_front' => false,'hierarchical' => true,'slug' => 'column/category'),//ここが大事！
      'show_ui' => true,
      'show_in_rest' => true,
      )
    );

}
add_action('init','registerPostandTaxonomy');


//カスタムタクソノミーのアーカイブのURLの構造を変更する場合
add_rewrite_rule('column/category/([^/]+)/?$', 'index.php?column_category=$matches[1]', 'top');
add_action( 'template_redirect', 'my_redirect' );
function my_redirect() {
	$url_now = $_SERVER['REQUEST_URI'];
	if($url_now == "/column/category/"){
        $url = home_url('/column/', 'https');
        wp_safe_redirect( $url, 301 );
        exit();
  }
}

//カスタムタクソノミーをラジオボタンにするやつ
add_action( 'admin_print_footer_scripts', 'select_to_radio_taxonomy' );
function select_to_radio_taxonomy() {
    ?>
    <script type="text/javascript">
    jQuery( function( $ ) {
        // 投稿画面
        $( '#taxonomy-facility_area input[type=checkbox]' ).each( function() {
            $( this ).replaceWith( $( this ).clone().attr( 'type', 'radio' ) );
        } );
        // 一覧画面
        var facility_area_checklist = $( '.facility_area-checklist input[type=checkbox]' );
        facility_area_checklist.click( function() {
          $( this ).closest( '.facility_area-checklist' ).find( ' input[type=checkbox]' ).not(this).prop( 'checked', false );
        } );
    } );
    </script>
    <?php
}

//カスタム投稿のパーマリンクをIDにする
function custom_post_type_link( $link, $post ){
  if ( $post->post_type === 'hogehoge' ) {
    return home_url( '/hogehoge/' . $post->ID );
  } else if ( $post->post_type === 'poyopoyo' ) {
    return home_url( '/poyopoyo/' . $post->ID );
  } else {
    return $link;
  }
}
add_filter( 'post_type_link', 'custom_post_type_link', 1, 2 );

function custom_rewrite_rules_array( $rules ) {
  $new_rewrite_rules = array( 
    'hogehoge/([0-9]+)/?$' => 'index.php?post_type=hogehoge&p=$matches[1]',
    'poyopoyo/([0-9]+)/?$' => 'index.php?post_type=poyopoyo&p=$matches[1]',
  );
  return $new_rewrite_rules + $rules;
}
add_filter( 'rewrite_rules_array', 'custom_rewrite_rules_array' );

/*
=====================================================================
=====================================================================
meta 
=====================================================================
=====================================================================
*/
 
// カスタムフィールド追加
add_action('admin_menu', 'metaAddCustomFields');
add_action('save_post', 'metaSaveCustomFields');
function metaAddCustomFields() {
  add_meta_box( 'meta_f02', 'メタディスクリプション', 'metaDescription', 'post');
  add_meta_box( 'meta_f02', 'メタディスクリプション', 'metaDescription', 'page');
  //カスタム投稿にも追加する時は以下
  add_meta_box( 'meta_f02', 'メタディスクリプション', 'metaDescription', 'hogehogehoge');
}
 
// カスタムフィールドの入力欄表示
function metaDescription() {
  global $post;
  $f_data = get_post_meta($post->ID,'meta_description',true);
  wp_nonce_field( wp_create_nonce( __FILE__ ), 'ul_nonce' );
  echo '<p>メタディスクリプションを入力してください。</p>';
  echo '<textarea style="width:100%" rows="4" type="text" name="meta_description">'.htmlspecialchars($f_data).'</textarea>';
}
 
// カスタムフィールドの値を保存
function metaSaveCustomFields( $post_id ) {
 
  //nonceによるセキュリティ対策
  $ul_nonce = isset( $_POST['ul_nonce'] ) ? $_POST['ul_nonce'] : null;
  if ( !wp_verify_nonce( $ul_nonce, wp_create_nonce( __FILE__ ) ) ) {
      return $post_id;
  }
 
  //例外処理
  if( defined('DOING_AUTOSAVE') && DOING_AUTOSAVE ) { 
    return $post_id;
  }
  if ( !current_user_can( 'edit_post', $post_id ) ) {
    return $post_id;
  }
 
  //カスタムフィールドのキー一覧
  $keys = array(
    'meta_description',
  );
  
  //カスタムフィールドの更新
  foreach( $keys as $key ){
    $data = $_POST[$key];
    if ( get_post_meta( $post_id, $key ) == "" ) {
        add_post_meta( $post_id, $key, $data, true );
    } elseif ( $data != get_post_meta( $post_id, $key, true ) ) {
        update_post_meta( $post_id, $key, $data );
    } elseif ( $data == "" ) {
        delete_post_meta( $post_id, $key, get_post_meta( $post_id, $key, true ) );
    }
  }
}

/*
=====================================================================
=====================================================================
子ページ判定
=====================================================================
=====================================================================
*/
function is_subpage() {
    global $post;
 
    if (is_page() && $post->post_parent) {
        return $post->post_parent;
    } else {
        return false;
    }
}
function is_tree( $pid ) {
    global $post;     

    if ( is_page( $pid ) )
        return true;

    $anc = get_post_ancestors( $post->ID );
    foreach ( $anc as $ancestor ) {
        if( is_page() && $ancestor == $pid ) {
            return true;
        }
    }

    return false;
}


/*
=====================================================================
=====================================================================
フリーワード検索
=====================================================================
=====================================================================
*/
function SearchFilter($query) {
  if ($query->is_search) {
    $query->set('post_type', array ('page','news','column','facility','conference'));
  }
  return $query;
}
add_filter('pre_get_posts','SearchFilter');

//検索キーワードに必ず何か入れないと検索結果ページが表示されないのを解除
function custom_search($search, $wp_query  ) {
    //query['s']があったら検索ページ表示
    if ( isset($wp_query->query['s']) ) $wp_query->is_search = true;
    return $search;
}
add_filter('posts_search','custom_search', 10, 2);
