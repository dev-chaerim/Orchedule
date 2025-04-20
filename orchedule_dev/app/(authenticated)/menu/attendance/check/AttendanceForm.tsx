'use client';

import { useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { format } from 'date-fns';

const statuses = ['참여', '지각', '불참'];

export default function AttendanceForm() {
  const [date] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState(statuses[0]);

  const handleSave = () => {
    alert(`${format(date, 'yyyy-MM-dd')} 출석 상태: ${selectedStatus}`);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[640px]">
        {/* 섹션 타이틀 */}
        <h2 className="text-m font-bold text-[#3e3232] mb-4 mx-4">출결 등록</h2>

        {/* 카드 */}
        <div className="bg-white rounded-xl p-4 py-6 mx-4 border border-[#e9e4dc]">
          <div className="flex justify-center items-center gap-4 flex-wrap w-full">
            {/* 날짜 */}
            <div className="flex flex-col items-center justify-center w-[100px] h-[90px] bg-white rounded-xl shadow">
              <div className="text-[13px] text-[#7e6a5c]">{format(date, 'MMM')}</div>
              <div className="text-[20px] font-bold text-[#3e3232e7]">{format(date, 'd')}</div>
            </div>

            {/* 상태 박스 */}
            <div className="w-[100px] h-[90px] flex items-center justify-center bg-[#D7C0AE] text-white text-sm font-semibold rounded-xl shadow">
              {selectedStatus}
            </div>

            {/* 드롭다운 + 버튼 */}
            <div className="flex flex-col gap-2 items-center">
              <Listbox value={selectedStatus} onChange={setSelectedStatus}>
                <div className="relative w-[100px]">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-[#f8f6f2] py-2 pl-4 pr-8 text-sm text-[#3e3232d4] shadow font-semibold text-center">
                    {selectedStatus}
                    <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                      <ChevronDownIcon className="h-4 w-4 text-[#7e6a5c]" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 w-full rounded-xl bg-white shadow-lg z-10 text-sm text-[#3e3232]">
                      {statuses.map((status) => (
                        <Listbox.Option
                          key={status}
                          className={({ active }) =>
                            `cursor-pointer select-none px-4 py-2 text-center ${active ? 'bg-[#f0eae1]' : ''}`
                          }
                          value={status}
                        >
                          {status}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>

              <button
                onClick={handleSave}
                className="w-[100px] bg-[#e5d5ae] text-white rounded-xl py-2 text-sm font-semibold shadow hover:opacity-90 transition text-center"
              >
                변경
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
