// 入口
import {ApiPromise} from '@polkadot/api';
import {
  EraResult,
  ClassifyResult,
  ClassifyArg,
  EraArg,
  AccountArg,
  AccountType,
  Role,
  Status,
} from '../../interface';
import {
  trillionCruFormat,
  getControllerAddressByStashAddress,
  getNominators,
  getAccountDisplay,
  classifyIdentify,
  filterRepeatData,
  compare,
} from '../../util';
import {queryPledge} from '../pledge';
import {queryMember} from '../member';
import {CeNominator} from '../../model';
import CrustPool from '../../crust-pool/';
import {queryAccount} from '../account';
/**
 * 通过验证人hash查询并返回ce_validator信息
 *
 * @export
 * @param {string} validatorHash 验证人账户地址，stash地址
 * @param {number} rank 验证人排名
 * @param {ApiPromise} api
 * @return {*}  {Promise<CeValidatorPledge>}
 */
export async function queryEras() {
  /* 获取所有账户 */
  let [overview, waitingValidatorAddress, chainAllAccount]: any =
    await Promise.all([
      CrustPool.Run<any>((api: ApiPromise) => {
        return api.derive.staking.overview();
      }),
      CrustPool.Run<any>((api: ApiPromise) => {
        return api.derive.staking.waitingInfo();
      }),
      CrustPool.Run<any>((api: ApiPromise) => {
        return api.query.system.account.entries();
      }),
    ]);
  overview = overview || undefined;
  chainAllAccount = chainAllAccount.map((it: any) => it[0].toHuman()[0]);
  waitingValidatorAddress = waitingValidatorAddress.info.map((it: any) => {
    return {
      stashAddress: it.accountId.toJSON(),
      controllerAddress: it.controllerId.toJSON(),
    };
  });

  const activeEra: number = overview.activeEra.toJSON();
  const activeEraStart: number =
    (overview.activeEraStart.toJSON() as number) / 1000;
  const validatorCount: number = overview.validatorCount.toJSON() as number;
  const eraInfo: EraArg = {
    activeEraStart,
    activeEra,
    validatorCount,
  };
  const validatorAddresses: string[] = (
    overview.validators as any
  ).toJSON() as string[];
  /* 总数 = api.derive.staking.overview()返回的nextElected剔除验证人 + api.derive.staking.waitingInfo() */
  let totalWaitingValidatorAddress: any[] = [];
  /* 上边总数第一个 */
  const filterWaitingValidator = overview.nextElected.filter((item: any) => {
    item = item.toJSON();
    return !validatorAddresses.includes(item);
  });
  /* 查询每个候选验证人的控制账户地址 */

  const addStashFilterWaitingValidator = (
    await getControllerAddressByStashAddress(filterWaitingValidator)
  ).map((it: any, curIndex: number) => ({
    stashAddress: filterWaitingValidator[curIndex],
    controllerAddress: it,
  }));
  // 添加

  totalWaitingValidatorAddress = [
    ...waitingValidatorAddress,
    ...addStashFilterWaitingValidator,
  ];

  const targetWaitingValidator = totalWaitingValidatorAddress.map(
    (hash: any, rank: number) => {
      const validatorHash: string = hash.stashAddress;
      return {
        address: validatorHash,
        rank,
        role: Role.WaitingValidator,
      };
    }
  );
  const targetValidator = validatorAddresses.map(
    (validatorHash: string, rank: number) => {
      return {
        address: validatorHash,
        rank,
        role: Role.Validator,
      };
    }
  );
  /* 查询验证人和候选验证人的质押信息 */
  const pledgeAll = await queryPledge(
    [...targetValidator, ...targetWaitingValidator],
    eraInfo
  );
  const [validatorsNominators, waitingValidatorNominators]: Array<
    Array<{
      validatorAddress: string;
      nominators: any[];
    }>
  > = await Promise.all([
    getNominators(
      targetValidator.map(it => it.address),
      activeEra
    ) as any,
    getNominators(
      targetWaitingValidator.map(it => it.address),
      activeEra
    ) as any,
  ]);

  let totalNominators: CeNominator[] = [
    validatorsNominators,
    waitingValidatorNominators,
  ]
    .map((iooo: any) => {
      return iooo.map((it: any) => {
        const totalBonded = it.nominators
          .map((ittttt: any) => ittttt.value)
          .reduce((prev: number, cur: string) => {
            return prev + Number(cur);
          }, 0);
        const res: CeNominator[] = it.nominators.map(
          (ittt: any, rank: number): CeNominator => {
            return {
              era: activeEra,
              nominatorRank: rank,
              bonded: trillionCruFormat(ittt.value),
              nominatorAddress: ittt.who,
              validatorAddress: it.validatorAddress,
              accountDisplay: '', // 下边代码有加上
              quotient: String(Number(ittt.value) / totalBonded),
            };
          }
        );
        return res;
      });
    })
    .reduce((prev, cur) => [...prev, ...cur], [])
    .reduce((prev: any[], cur: any[]) => [...prev, ...cur], []);
  const nominatorAccountDisplays: any = await getAccountDisplay(
    totalNominators.map((it: any) => ({address: it.nominatorAddress}))
  );

  totalNominators = totalNominators.map((it: any, curIndex: number) => ({
    ...it,
    accountDisplay: JSON.stringify(nominatorAccountDisplays[curIndex]),
  }));
  const validatorMapToMember = [targetValidator, targetWaitingValidator]
    .map((it: any, tmpIndex: number) => {
      // address: string,//存储账户，不能是控制账户
      //     role: number,//1为验证人，2为候选验证人
      //     rank: number
      return it.map((item: any) => {
        const role: Role =
          tmpIndex === 0 ? Role.Validator : Role.WaitingValidator;
        return {
          address: item.address,
          role,
          rank: item.rank,
        };
      });
    })
    .reduce((prev, cur) => [...prev, ...cur], []);
  const filterRepeatNominator: any = [];
  totalNominators.forEach((it: any) => {
    if (
      !filterRepeatNominator.find(
        (item: any) => item.nominatorAddress === it.nominatorAddress
      )
    ) {
      filterRepeatNominator.push(it);
    }
  });
  const tmpTotalValidator = [...targetValidator, ...targetWaitingValidator];
  const controllerAddress = await getControllerAddressByStashAddress(
    tmpTotalValidator.map(it => it.address)
  );
  const validatorMapToAccount: AccountArg[] = tmpTotalValidator
    .map((it: any, curIndex: number) => {
      const res: AccountArg[] = [
        {
          address: it.address,
          role: it.role, // 1为验证人，2为候选验证人,3为提名人
          accountType: AccountType.Stash,
        },
        {
          address: controllerAddress[curIndex],
          role: it.role, // 1为验证人，2为候选验证人,3为提名人
          accountType: AccountType.Controller,
        },
      ];
      return res;
    })
    .reduce((prev, cur) => [...prev, ...cur], []);
  const nominatorControllerAddress: string[] =
    await getControllerAddressByStashAddress(
      filterRepeatNominator.map((it: any) => it.nominatorAddress)
    );
  const filterRepeatNominatorToAccount: AccountArg[] = filterRepeatNominator
    .map((it: any, curIndex: number) => {
      const res: AccountArg[] = [
        {
          address: it.nominatorAddress,
          role: Role.Nominator,
          accountType: AccountType.Stash,
        },
        {
          address: nominatorControllerAddress[curIndex],
          role: Role.Nominator,
          accountType: AccountType.Controller,
        },
      ];
      return res;
    })
    .reduce((prev: AccountArg[], cur: AccountArg[]) => [...prev, ...cur], []);

  /* 获取议会成员，技术委员会成员，身份注册商成员 */
  let [councilMembers, technicalCommittees, registrars]: any =
    await Promise.all([
      CrustPool.Run<any>((api: ApiPromise) => {
        return api.query.council.members();
      }),
      CrustPool.Run<any>((api: ApiPromise) => {
        return api.query.technicalCommittee.members();
      }),
      CrustPool.Run<any>((api: ApiPromise) => {
        return api.query.identity.registrars();
      }),
    ]);
  councilMembers = councilMembers.toJSON();
  technicalCommittees = technicalCommittees.toJSON();
  registrars = registrars.toJSON().map((it: any) => it.account);
  const stashClassifyArgs: ClassifyArg[] = [
    {
      data: councilMembers,
      type: 'isCouncilMember',
    },
    {
      data: technicalCommittees,
      type: 'isTechcommMember',
    },
    {
      data: registrars,
      type: 'isRegistrar',
    },
  ];
  const [
    councilMembersControllAddress,
    technicalCommitteesControllAddress,
    registrarsAddress,
  ] = await Promise.all([
    getControllerAddressByStashAddress(councilMembers),
    getControllerAddressByStashAddress(technicalCommittees),
    getControllerAddressByStashAddress(registrars),
  ]);

  const controllClassifyArgs: ClassifyArg[] = [
    {
      data: councilMembersControllAddress,
      type: 'isCouncilMember',
    },
    {
      data: technicalCommitteesControllAddress,
      type: 'isTechcommMember',
    },
    {
      data: registrarsAddress,
      type: 'isRegistrar',
    },
  ];
  const stashClassifyResult: ClassifyResult[] =
    classifyIdentify(stashClassifyArgs);
  const controllerClassifyResult: ClassifyResult[] =
    classifyIdentify(controllClassifyArgs);

  const filterRepeatClassifyResult = stashClassifyResult.map(it => ({
    ...it,
    accountType: AccountType.Stash,
  }));
  controllerClassifyResult.forEach((item): any => {
    if (!filterRepeatClassifyResult.find(it => it.data === item.data)) {
      return {
        ...item,
        accountType: AccountType.Controller,
      };
    }
  });
  const filterRepeatClassifyResultMapToAccount = filterRepeatClassifyResult.map(
    item => {
      const identifyObj = item.type.reduce(
        (prev, cur) => ({...prev, [cur]: Status.Yes}),
        {}
      );
      const res: AccountArg = {
        address: item.data,
        accountType: item.accountType, // 1为存储账户，2为控制账户
        ...identifyObj,
      };
      return res;
    }
  );

  let allAccount = [
    ...validatorMapToAccount,
    ...filterRepeatNominatorToAccount,
    ...filterRepeatClassifyResultMapToAccount,
  ];

  /* 过滤掉address和accountType重复的 */
  allAccount = filterRepeatData(allAccount, ['address', 'accountType']);

  // /* 获取所有账户 */

  /* chainAllAccountOnlyId: allAccount中没有的stash账户和控制账户 */
  const chainAllAccountOnlyId = compare(
    filterRepeatData(chainAllAccount),
    filterRepeatData(allAccount.map(it => it.address))
  ).arr1Only;
  const chainAllAccountOnlyControllId =
    await getControllerAddressByStashAddress(chainAllAccountOnlyId);

  let chainAllAccountMapToAccount: AccountArg[] = chainAllAccountOnlyId
    .map((item: any, index: number) => {
      const controllAddress = chainAllAccountOnlyControllId[index];
      if (controllAddress) {
        /* 查询的到控制账户，接下来判断是不是同个账户 */
        if (controllAddress === item) {
          return [
            {
              address: item,
              accountType: AccountType.Stash,
            },
          ];
        } else {
          return [
            {
              address: item,
              accountType: AccountType.Stash,
            },
            {
              address: controllAddress,
              accountType: AccountType.Controller,
            },
          ];
        }
      } else {
        /* 查询不到控制账户，说明item本身就是控制账户 */
        return [
          {
            address: item,
            accountType: AccountType.Controller,
          },
        ];
      }
    })
    .reduce((prev: any, cur: any) => [...prev, ...cur], []);
  chainAllAccountMapToAccount = filterRepeatData(chainAllAccountMapToAccount, [
    'address',
    'accountType',
  ]);

  const totalAccount = [...allAccount, ...chainAllAccountMapToAccount];

  //   debugger;
  const members = await queryMember(validatorMapToMember, eraInfo);
  const accountRes = await queryAccount(totalAccount);
  //   debugger;
  const res: EraResult = {
    eraStat: {
      era: activeEra,
      startBlockTimestamp: activeEraStart,
    },
    bondedPledges: pledgeAll, // 完成
    members,
    // validatorPledges: resValidators,
    nominators: totalNominators,
    accounts: accountRes,
  };

  return {
    response: res,
    realNominatorLen: filterRepeatNominator.length,
    validatorLen: targetValidator.length,
    waitingValidatorLen: targetWaitingValidator.length,
  };
}
