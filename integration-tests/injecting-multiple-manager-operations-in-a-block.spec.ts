import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;
    describe(`Test injecting more than one manager operation in a block: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })
        test('Verify that doing transfers without awaiting the confirmation after each will fail', async (done) => {
            try {
                const op1 = await Tezos.contract.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 1 });
                const op2 = await Tezos.contract.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 });

                await op1.confirmation();
                await op2.confirmation();

            } catch (error) {
                expect(error.message).toContain('Only one manager operation per manager per block allowed');
            }
            done();
        })
    });
})