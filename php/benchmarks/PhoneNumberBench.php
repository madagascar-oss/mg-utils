<?php

declare(strict_types=1);

namespace Madagascar\MgUtils\Benchmarks;

use Madagascar\MgUtils\Phone\PhoneNumber;
use Madagascar\MgUtils\Phone\PhoneNumberFormat;

final class PhoneNumberBench
{
    public function benchParseNationalWithSpaces(): void
    {
        PhoneNumber::parse('034 12 345 67');
    }

    public function benchFormatInternational(): string
    {
        return PhoneNumber::parse('+261341234567')->format(PhoneNumberFormat::International);
    }
}
