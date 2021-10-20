<?php

use Illuminate\Database\Migrations\Migration;

class addCustomizeSettings extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('settings')->insertOrIgnore(
            array(
                'key' => 'settings::customize:background',
                'value' => '#0F1032'
            )
        );

        DB::table('settings')->insertOrIgnore(
            array(
                'key' => 'settings::customize:secondary',
                'value' => '#1B1C3E'
            )
        );

        DB::table('settings')->insertOrIgnore(
            array(
                'key' => 'settings::customize:border',
                'value' => '#37d5f2'
            )
        );

        DB::table('settings')->insertOrIgnore(
            array(
                'key' => 'settings::customize:other',
                'value' => '#24284C'
            )
        );

        DB::table('settings')->insertOrIgnore(
            array(
                'key' => 'settings::customize:dropdown',
                'value' => '#111229'
            )
        );

        DB::table('settings')->insertOrIgnore(
            array(
                'key' => 'settings::customize:warning',
                'value' => '#fb6340'
            )
        );

        DB::table('settings')->insertOrIgnore(
            array(
                'key' => 'settings::customize:darkButton',
                'value' => '#172b4d'
            )
        );

        DB::table('settings')->insertOrIgnore(
            array(
                'key' => 'settings::customize:red',
                'value' => '#f5365c'
            )
        );

        DB::table('settings')->insertOrIgnore(
            array(
                'key' => 'settings::customize:green',
                'value' => '#2dce89'
            )
        );

        DB::table('settings')->insertOrIgnore(
            array(
                'key' => 'settings::customize:purple',
                'value' => '#5e72e4'
            )
        );

        DB::table('settings')->insertOrIgnore(
            array(
                'key' => 'settings::customize:code',
                'value' => '#f3a4b5'
            )
        );

        DB::table('settings')->insertOrIgnore(
            array(
                'key' => 'settings::customize:textColor',
                'value' => '#fff'
            )
        );

        DB::table('settings')->insertOrIgnore(
            array(
                'key' => 'settings::customize:textLight',
                'value' => '#ced4da'
            )
        );


        DB::table('settings')->insertOrIgnore(
            array(
                'key' => 'settings::customize:textMuted',
                'value' => '#8898aa'
            )
        );

        DB::table('settings')->insertOrIgnore(
            array(
                'key' => 'settings::customize:mainIconBackground',
                'value' => 'rgba(20, 104, 113, 0.702)'
            )
        );

        DB::table('settings')->insertOrIgnore(
            array(
                'key' => 'settings::customize:mainIconColor',
                'value' => 'rgb(56, 236, 236)'
            )
        );

        DB::table('settings')->insertOrIgnore(
            array(
                'key' => 'settings::customize:infoIconBackground',
                'value' => 'rgba(94, 114, 228, 0.102)'
            )
        );

        DB::table('settings')->insertOrIgnore(
            array(
                'key' => 'settings::customize:infoIconColor',
                'value' => '#8898aa'
            )
        );

        DB::table('settings')->insertOrIgnore(
            array(
                'key' => 'settings::customize:info',
                'value' => '#176775'
            )
        );

        DB::table('settings')->insertOrIgnore(
            array(
                'key' => 'settings::customize:danger',
                'value' => '#f75676'
            )
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('settings')
            ->where('key', 'settings::customize:background')
            ->delete();

        DB::table('settings')
            ->where('key', 'settings::customize:secondary')
            ->delete();

        DB::table('settings')
            ->where('key', 'settings::customize:border')
            ->delete();

        DB::table('settings')
            ->where('key', 'settings::customize:other')
            ->delete();

        DB::table('settings')
            ->where('key', 'settings::customize:dropdown')
            ->delete();

        DB::table('settings')
            ->where('key', 'settings::customize:warning')
            ->delete();

        DB::table('settings')
            ->where('key', 'settings::customize:darkButton')
            ->delete();

        DB::table('settings')
            ->where('key', 'settings::customize:red')
            ->delete();

        DB::table('settings')
            ->where('key', 'settings::customize:green')
            ->delete();

        DB::table('settings')
            ->where('key', 'settings::customize:purple')
            ->delete();

        DB::table('settings')
            ->where('key', 'settings::customize:code')
            ->delete();

        DB::table('settings')
            ->where('key', 'settings::customize:textColor')
            ->delete();

        DB::table('settings')
            ->where('key', 'settings::customize:textLight')
            ->delete();

        DB::table('settings')
            ->where('key', 'settings::customize:textMuted')
            ->delete();

        DB::table('settings')
            ->where('key', 'settings::customize:mainIconBackground')
            ->delete();

        DB::table('settings')
            ->where('key', 'settings::customize:mainIconColor')
            ->delete();

        DB::table('settings')
            ->where('key', 'settings::customize:infoIconBackground')
            ->delete();

        DB::table('settings')
            ->where('key', 'settings::customize:infoIconColor')
            ->delete();

        DB::table('settings')
            ->where('key', 'settings::customize:info')
            ->delete();

        DB::table('settings')
            ->where('key', 'settings::customize:danger')
            ->delete();
    }
}
