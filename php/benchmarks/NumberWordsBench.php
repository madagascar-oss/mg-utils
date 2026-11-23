<?php

declare(strict_types=1);

namespace Madagascar\MgUtils\Benchmarks;

use Madagascar\MgUtils\Words\NumberWords;

final class NumberWordsBench
{
    public function benchSmall(): void
    {
        NumberWords::fromInt(21);
    }

    public function benchLargest(): void
    {
        NumberWords::fromInt(999_999_999_999);
    }
}
