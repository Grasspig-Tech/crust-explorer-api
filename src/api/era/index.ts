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
/**
 * 通过验证人hash查询并返回ce_validator信息
 *
 * @export
 * @param {string} validatorHash 验证人账户地址，stash地址
 * @param {number} rank 验证人排名
 * @param {ApiPromise} api
 * @return {*}  {Promise<CeValidatorPledge>}
 */
export async function queryEras({api}: {api: ApiPromise}) {
  // debugger;
  /* 获取所有账户 */
  // eslint-disable-next-line prefer-const
  let [overview, waitingValidatorAddress, chainAllAccount]: any =
    await Promise.all([
      api.derive.staking.overview(),
      api.derive.staking.waitingInfo(),
      api.query.system.account.entries(),
    ]);
  chainAllAccount = chainAllAccount.map((it: any) => it[0].toHuman()[0]);
  waitingValidatorAddress = waitingValidatorAddress.info.map((it: any) => {
    return {
      stashAddress: it.accountId.toJSON(),
      controllerAddress: it.controllerId.toJSON(),
    };
  });

  // debugger;
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
  const totalWaitingValidatorAddress = [];
  /* 上边总数第一个 */
  const filterWaitingValidator = overview.nextElected
    .map((it: any) => it.toJSON())
    .filter((item: any) => {
      return !validatorAddresses.includes(item);
    });
  /* 查询每个候选验证人的控制账户地址 */
  // debugger;
  const addStashFilterWaitingValidator = (
    await getControllerAddressByStashAddress(filterWaitingValidator, api)
  ).map((it: any, curIndex: number) => ({
    stashAddress: filterWaitingValidator[curIndex],
    controllerAddress: it,
  }));
  //添加
  // debugger;
  totalWaitingValidatorAddress.push(...waitingValidatorAddress);
  totalWaitingValidatorAddress.push(...addStashFilterWaitingValidator);

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
    api,
    eraInfo
  );
  const [validatorsNominators, waitingValidatorNominators]: {
    validatorAddress: string;
    nominators: any[];
  }[][] = await Promise.all([
    getNominators(
      targetValidator.map(it => it.address),
      activeEra,
      api
    ) as any,
    getNominators(
      targetWaitingValidator.map(it => it.address),
      activeEra,
      api
    ) as any,
  ]);
  // debugger;
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
            // debugger;
            return {
              era: activeEra,
              nominatorRank: rank,
              bonded: trillionCruFormat(ittt.value),
              nominatorAddress: ittt.who,
              validatorAddress: it.validatorAddress,
              accountDisplay: '', //下边代码有加上
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
    totalNominators.map((it: any) => ({address: it.nominatorAddress})),
    api
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return it.map((item: any, curIndex: number) => {
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
    // debugger;
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
    tmpTotalValidator.map(it => it.address),
    api
  );
  const validatorMapToAccount: AccountArg[] = tmpTotalValidator
    .map((it: any, curIndex: number) => {
      const res: AccountArg[] = [
        {
          address: it.address,
          role: it.role, //1为验证人，2为候选验证人,3为提名人
          accountType: AccountType.Stash,
        },
        {
          address: controllerAddress[curIndex],
          role: it.role, //1为验证人，2为候选验证人,3为提名人
          accountType: AccountType.Controller,
        },
      ];
      return res;
    })
    .reduce((prev, cur) => [...prev, ...cur], []);
  const nominatorControllerAddress: string[] =
    await getControllerAddressByStashAddress(
      filterRepeatNominator.map((it: any) => it.nominatorAddress),
      api
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
    await api.queryMulti([
      [api.query.council.members],
      [api.query.technicalCommittee.members],
      [api.query.identity.registrars],
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
    getControllerAddressByStashAddress(councilMembers, api),
    getControllerAddressByStashAddress(technicalCommittees, api),
    getControllerAddressByStashAddress(registrars, api),
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
        accountType: item.accountType, //1为存储账户，2为控制账户
        ...identifyObj,
        // isCouncilMember?: number,
        // isEvmContract?: number,
        // isRegistrar?: number,
        // isTechcommMember?: number,
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
  // let chainAllAccount: any[] = await api.query.system.account.entries();
  // chainAllAccount = chainAllAccount.map(it => it[0].toHuman()[0]);

  /* chainAllAccountOnlyId: allAccount中没有的stash账户和控制账户 */
  const chainAllAccountOnlyId = compare(
    chainAllAccount,
    filterRepeatData(allAccount.map(it => it.address))
  ).arr1Only;
  const chainAllAccountOnlyControllId =
    await getControllerAddressByStashAddress(chainAllAccountOnlyId, api);

  let chainAllAccountMapToAccount: AccountArg[] = chainAllAccountOnlyId
    .map((item: any, index: number) => {
      // let ttt = chainAllAccountOnlyControllId;
      // let ttt22 = chainAllAccountOnlyId;
      // let ttt33 = chainAllAccountMapToAccount;
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
  // debugger
  //   debugger;
  const members = await queryMember(validatorMapToMember, api, eraInfo);
  // const accounts = await queryAccount(totalAccount, api);
  //   debugger;
  const res: EraResult = {
    eraStat: {
      era: activeEra,
      startBlockTimestamp: activeEraStart,
    },
    bondedPledges: pledgeAll, //完成
    members,
    // validatorPledges: resValidators,
    nominators: totalNominators,
    accounts: totalAccount,
  };
  // debugger;
  return {
    response: res,
    realNominatorLen: filterRepeatNominator.length,
    validatorLen: targetValidator.length,
    waitingValidatorLen: targetWaitingValidator.length,
  };
}
