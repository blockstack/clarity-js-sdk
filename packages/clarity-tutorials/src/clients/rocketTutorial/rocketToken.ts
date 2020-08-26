import { Client, Provider, Receipt, Result } from '@blockstack/clarity';

export class RocketTokenClient extends Client {
  constructor(provider: Provider) {
    super(
      'SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.rocket-token',
      'rocket-tutorial/rocket-token',
      provider
    );
  }

  async transfer(to: string, value: number, params: { sender: string }): Promise<Receipt> {
    const tx = this.createTransaction({
      method: { name: 'transfer-token', args: [`'${to}`, `u${value}`] },
    });
    await tx.sign(params.sender);
    const res = await this.submitTransaction(tx);
    return res;
  }

  async balanceOf(owner: string): Promise<number> {
    const query = this.createQuery({
      atChaintip: true,
      method: { name: 'balance-of', args: [`'${owner}`] },
    });
    const res = await this.submitQuery(query);
    return Result.unwrapUInt(res);
  }

  async totalSupply(): Promise<number> {
    const query = this.createQuery({
      atChaintip: true,
      method: { name: 'get-total-supply', args: [] },
    });
    const res = await this.submitQuery(query);
    return Result.unwrapUInt(res);
  }
}
