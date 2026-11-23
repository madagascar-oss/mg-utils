<?php

declare(strict_types=1);

namespace Madagascar\MgUtils\Tests\Words;

use Madagascar\MgUtils\ErrorCode;
use Madagascar\MgUtils\MgUtilsException;
use Madagascar\MgUtils\Words\NumberWords;
use PHPUnit\Framework\TestCase;

final class NumberWordsTest extends TestCase
{
    public function testReturnsLowercaseWordsForRandomSupportedIntegers(): void
    {
        mt_srand(2026);
        for ($run = 0; $run < 2000; ++$run) {
            $words = NumberWords::fromInt(mt_rand(0, 999_999_999_999));

            self::assertMatchesRegularExpression("/^[a-z' ]+$/", $words);
            self::assertDoesNotMatchRegularExpression('/ {2}|^ | $/', $words);
        }
    }

    public function testThrowsOutOfRangeWithTheSharedCode(): void
    {
        try {
            NumberWords::fromInt(PHP_INT_MAX);
            self::fail('Expected MgUtilsException');
        } catch (MgUtilsException $exception) {
            self::assertSame(ErrorCode::OutOfRange, $exception->errorCode);
        }
    }
}
