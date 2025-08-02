import React, { useEffect, useState } from 'react';
import { dummyPublishedCreationData } from '../assets/assets';
import { FileVideo, Heart } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();

  const fetchCreations = async () => {
    setCreations(dummyPublishedCreationData);
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  return (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h2 className="text-xl font-semibold text-slate-700 mb-2">Creations</h2>
      <div className="bg-white h-full rounded-xl overflow-y-scroll flex flex-wrap gap-4 p-4">
        {creations.map((creation, index) => (
          <div
            key={index}
            className="relative group w-full sm:max-w-[48%] lg:max-w-[32%] aspect-video rounded-lg overflow-hidden"
          >
            <img
              src={creation.content}
              alt="creation"
              className="w-full h-full object-cover rounded-lg"
            />

            <div className="absolute bottom-0 top-0 right-0 left-0 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg transition-all">
              <p className="text-sm hidden group-hover:block">{creation.prompt}</p>
              <div className="flex gap-1 items-center">
                <p>{creation.likes?.length || 0}</p>
                <Heart
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${
                    creation.likes?.includes(user?.id)
                      ? 'fill-red-500 text-red-600'
                      : 'text-white'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
