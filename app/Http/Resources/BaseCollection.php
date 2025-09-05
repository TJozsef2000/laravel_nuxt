<?php

declare(strict_types=1);

// app/Http/Resources/BaseCollection.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;

class BaseCollection extends ResourceCollection
{
    protected string $message;

    protected bool $success;

    protected int $code;

    public function __construct($resource, string $message = 'Data fetched successfully', bool $success = true, int $code = 200)
    {
        parent::__construct($resource);
        $this->message = $message;
        $this->success = $success;
        $this->code = $code;
    }

    public function toArray(Request $request): array
    {
        $data = [
            'success' => $this->success,
            'code' => $this->code,
            'message' => $this->message,
            'data' => [
                'items' => $this->collection,
            ],
        ];

        // Add pagination data only if the resource is paginated
        if ($this->resource instanceof LengthAwarePaginator) {
            $data['data']['pagination'] = [
                'current_page' => $this->resource->currentPage(),
                'per_page' => $this->resource->perPage(),
                'total' => $this->resource->total(),
                'last_page' => $this->resource->lastPage(),
                'next_page_url' => $this->resource->nextPageUrl(),
                'prev_page_url' => $this->resource->previousPageUrl(),
            ];
        }

        return $data;
    }
}
