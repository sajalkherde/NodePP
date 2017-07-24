<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit4252c866c88f8f426cef64e699d0d86c
{
    public static $prefixLengthsPsr4 = array (
        'D' => 
        array (
            'Dotenv\\' => 7,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Dotenv\\' => 
        array (
            0 => __DIR__ . '/..' . '/vlucas/phpdotenv/src',
        ),
    );

    public static $prefixesPsr0 = array (
        'S' => 
        array (
            'Slim' => 
            array (
                0 => __DIR__ . '/..' . '/slim/slim',
            ),
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit4252c866c88f8f426cef64e699d0d86c::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit4252c866c88f8f426cef64e699d0d86c::$prefixDirsPsr4;
            $loader->prefixesPsr0 = ComposerStaticInit4252c866c88f8f426cef64e699d0d86c::$prefixesPsr0;

        }, null, ClassLoader::class);
    }
}