var settings = {
      bridge: {
        capacity: 5,
        chPrefix: 'C',
        chIdxStart: 21
      },
      camera: {
        prefix: 'C',
        idxStart: 11
      },
      lsc: {
        types: [2, 5, [2, 5]],
        prefix: 'COM',
        idxStart: 5,
        curDrvIdxStart: 2,
        portPrefix: 'CN',
        portIdxStart: 1,
        powerPort: '24VDC',
        usbPort: 'USB',
        sixWayPortPrefix: 'C',
        sixWayPortIdxStart: 2,
        triggerPort: 'HD15',
        chPrefix: 'CH',
        chIdxStart: 1
      },
      pc: {
				maxCount: 5
			},
      vision: {
        maxCount: 10,
        cat: {
          bridge: [1, 2, 3],
          direct: [4, 5, 6, 7]
        },
        types: [
          'VsOC',
          'VsPC',
          'VsMO',
          'VsMLO',
          'VsMOP',
          'VsMLOP',
          'VsM',
          'VsML',
          'VsMP',
          'VsMLP',
          'VsLP',
          'VsIPM',
          'VsIPML',
          'VsIPMP',
          'VsIPMLP',
          'Vs3DLi',
          'Vs3DJLi',
          'Vs3DLi/TO',
          'VsPP5S',
          'VsPP4S-ASE CL',
          'VsPP',
          'Vs3D5S',
          'Vs3DLiMP',
          'Vs3D3S',
          'VsTS',
          'VsPPO',
          'VsSiBtm2',
          'VsSiBtm',
          'Vs3DBaPP',
          'VsPad',
          'VsP',
          'Vs3DMLi',
          'VsSL',
          'VsLi',
          'Vs3DLiP',
          'VsCT',
          'VsPP4S-Standard',
          'VsLensOC',
          'VsPP/BGA',
          'VsPP5SNC',
          'VsPP5S2',
          'VsP4S',
          'VsIPL/Slt',
          'VsTS/E',
          'VsIF',
          'VsIFP',
          'VsMeasure'
        ]
      }
    };