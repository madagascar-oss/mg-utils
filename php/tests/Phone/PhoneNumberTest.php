<?php

declare(strict_types=1);

namespace Madagascar\MgUtils\Tests\Phone;

use Madagascar\MgUtils\ErrorCode;
use Madagascar\MgUtils\MgUtilsException;
use Madagascar\MgUtils\Phone\Operator;
use Madagascar\MgUtils\Phone\PhoneNumber;
use Madagascar\MgUtils\Phone\PhoneNumberFormat;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class PhoneNumberTest extends TestCase
{
    public function testTryParseReturnsThePhoneNumberForValidInput(): void
    {
        self::assertSame(Operator::Telma, PhoneNumber::tryParse('034 12 345 67')?->operator);
    }

    public function testTryParseReturnsNullInsteadOfThrowing(): void
    {
        self::assertNull(PhoneNumber::tryParse('035 12 345 67'));
    }

    public function testRejectsInvalidUtf8AsInvalidFormat(): void
    {
        $this->expectExceptionObject(new MgUtilsException(ErrorCode::InvalidFormat, 'Phone numbers must be valid UTF-8 text.'));

        PhoneNumber::parse("034\xff12 345 67");
    }

    public function testNeverThrowsAnythingButMgUtilsExceptionForRandomStrings(): void
    {
        mt_srand(2026);
        $alphabet = "0123456789 +-.()_ab\u{a0}\u{ff10}";
        $characters = preg_split('//u', $alphabet, -1, \PREG_SPLIT_NO_EMPTY);
        self::assertIsArray($characters);
        for ($run = 0; $run < 2000; ++$run) {
            $input = '';
            for ($index = mt_rand(0, 20); $index > 0; --$index) {
                $input .= $characters[mt_rand(0, \count($characters) - 1)];
            }
            $phone = PhoneNumber::tryParse($input);

            self::assertSame($phone !== null, PhoneNumber::isValid($input));
        }
    }

    /**
     * @return iterable<string, array{PhoneNumberFormat}>
     */
    public static function formats(): iterable
    {
        foreach (PhoneNumberFormat::cases() as $format) {
            yield $format->value => [$format];
        }
    }

    #[DataProvider('formats')]
    public function testReadsBackEveryFormatItWrites(PhoneNumberFormat $format): void
    {
        $phone = PhoneNumber::parse('0381234567');

        self::assertEquals($phone, PhoneNumber::parse($phone->format($format)));
    }

    public function testNamesEveryOperator(): void
    {
        $names = array_map(static fn(Operator $operator): string => $operator->displayName(), Operator::cases());

        self::assertSame(['Orange Madagascar', 'Airtel Madagascar', 'Telma', 'Blueline'], $names);
    }
}
